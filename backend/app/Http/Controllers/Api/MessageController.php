<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Message;
use App\Models\Discussion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Exception;

class MessageController extends Controller
{
    /**
 * Envoie un message texte dans une discussion donnée.
 *
 * Cette fonction permet à un utilisateur d'envoyer un message texte dans une discussion, après avoir vérifié
 * que l'utilisateur fait bien partie de la discussion et que toutes les conditions de validation sont respectées.
 * Si la discussion est de type "DIFFUSION", seuls les administrateurs peuvent envoyer un message.
 * Si la discussion est "PRIVATE", un destinataire doit être déterminé et la relation entre les utilisateurs doit être validée.
 *
 * @param Request $request La requête HTTP contenant les données à valider et envoyer.
 * 
 * @return \Illuminate\Http\JsonResponse La réponse JSON contenant l'état de la requête, 
 *         soit un succès, soit un message d'erreur détaillant la cause.
 * 
 * @throws \Illuminate\Validation\ValidationException Si la validation échoue.
 */
    public function sendTextMessage(Request $request)
    {
          
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
               // 'discussionId' => 'required|exists:discussions,_id',
                'discussionId' => 'required',
                'text' => 'required|string',
                'file' => 'nullable|array',  // Valider comme tableau
                'signalers' => 'nullable|array',
                'messageId' => 'nullable|exists:messages,_id',  // Valider comme tableau
            ], [
                'discussionId.required' => 'L\'identifiant de la discussion est requis.',
                'discussionId.exists' => 'La discussion spécifiée n\'existe pas.',
                'text.required' => 'Le champ texte est obligatoire.',
                'text.string' => 'Le champ texte doit être une chaîne de caractères.',
                'file.array' => 'Le champ file doit être un tableau.',
                'signalers.array' => 'Le champ signalers doit être un tableau.',
                'messageId.exists' => 'Le message de référence spécifié n\'existe pas.',
            ]);
            

            // Vérification des erreurs de validation
            if ($validator->fails()) {
                return response()->json([
                    'status_code' => 400,
                    'message' => 'Bad Request',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $userId = auth()->id();
            $discussion = Discussion::where('_id', $request->discussionId)->first();
            
            // Vérification des droits
            $participant = collect($discussion->participants)->filter(function($participant) use ($userId) {
                return $participant['id'] == $userId;  // Utiliser un tableau associatif
            })->first();      
            
            if (!$participant) {
                return response()->json([
                    'status_code' => 403,
                    'message' => 'Vous n\'êtes pas un participant de cette discussion.',
                ], 403);
            }

            /**
             * @var array $discussion->tags
             */
            
            if (in_array('DIFFUSION', [$discussion->tags]) && !$participant['isAdmin']) {
                return response()->json([
                    'status_code' => 403,
                    'message' => 'Seuls les administrateurs peuvent envoyer des messages dans une discussion de type DIFFUSION.',
                ], 403);
            }

            if ($discussion->tags === 'PRIVATE') {
                // Recherche de l'identifiant du destinataire
                $recipientId = null;
            
                foreach ($discussion->participants as $participant) {
                    // Vérification si l'ID du participant est différent de celui de l'utilisateur actuel
                    if (isset($participant['id']) && $participant['id'] !== $userId) {
                        $recipientId = $participant['id'];
                        break;
                    }
                }
            
                // Si aucun destinataire n'est trouvé, renvoyer une erreur
                if (!$recipientId) {
                    return response()->json([
                        'status_code' => 400,
                        'message' => 'Impossible de déterminer le destinataire de cette discussion privée.',
                    ], 400);
                }
            
                // Vérification de la relation entre les utilisateurs
                $contact = Contact::where(function ($query) use ($userId, $recipientId) {
                    $query->where('idUser1', $userId)->where('idUser2', $recipientId)
                          ->orWhere(function ($query) use ($userId, $recipientId) {
                              $query->where('idUser1', $recipientId)->where('idUser2', $userId);
                          });
                })->first();
            
                // Vérification des blocages et de l'existence de la relation
                if (!$contact || $contact->isBlockedUser1 || $contact->isBlockedUser2) {
                    return response()->json([
                        'status_code' => 403,
                        'message' => 'Vous ne pouvez pas envoyer de message car vous êtes bloqué ou la relation n\'existe pas.',
                    ], 403);
                }
            
                // Vérification de l'acceptation de la relation
                if (!$contact->isAccepted) {
                    return response()->json([
                        'status_code' => 403,
                        'message' => 'Vous devez être en contact avec cet utilisateur pour envoyer un message.',
                    ], 403);
                }
            }
            
            // Création du message
            $message = new Message();
            $message->senderId = auth()->id();
            $message->discussionId = $request->input('discussionId');
            $message->text = $request->input('text');
            $message->messageId = $request->messageId ?? null;
            $message->createdAt = now();
            $message->updatedAt = now();
            $message->file = is_array($request->input('file')) ? $request->input('file') : [];
            $message->signalers = is_array($request->input('signalers')) ? $request->input('signalers') : [];
            $message->save();

            return response()->json([
                'status_code' => 200,
                'error' => false,
                'message' => 'Message envoyé avec succès.',
                'data' => $message,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Une erreur est survenue lors de l\'envoi du message.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Modifier un message  Il faut revenir vérifier cette partie du retour de messe
     */
    public function editMessage(Request $request, Message $message)
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'discussionId' => 'required',
                'text' => 'required|string',
            ], [
                'discussionId.required' => 'L\'identifiant de la discussion est requis.',
                'discussionId.exists' => 'La discussion spécifiée n\'existe pas.',
                'text.required' => 'Le champ texte est obligatoire.',
                'text.string' => 'Le champ texte doit être une chaîne de caractères.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status_code' => 400,
                    'message' => 'Bad Request',
                    'errors' => $validator->errors(),
                ], 400);
            }
            
            if (!$message) {
                return response()->json([
                    'status_code' => 404,
                    'message' => 'Message non trouvé.',
                ], 404);
            }

            if ($message->senderId !== auth()->id()) {
                return response()->json([
                    'status_code' => 403,
                    'message' => 'Vous n\'êtes pas autorisé à modifier ce message.',
                ], 403);
            }

            $userId = auth()->id();
            $discussion = Discussion::where('_id', $request->discussionId)->first();
            
            // Vérification des droits
            $participant = collect($discussion->participants)->filter(function($participant) use ($userId) {
                return $participant['id'] == $userId;  // Utiliser un tableau associatif
            })->first();      
            
            if (!$participant) {
                return response()->json([
                    'status_code' => 403,
                    'message' => 'Vous n\'êtes pas un participant de cette discussion.',
                ], 403);
            }
            
            if (in_array('DIFFUSION', [$discussion->tags]) && !$participant['isAdmin']) {
                return response()->json([
                    'status_code' => 403,
                    'message' => 'Seuls les administrateurs peuvent envoyer des messages dans une discussion de type DIFFUSION.',
                ], 403);
            }

            if ($discussion->tags === 'PRIVATE') {
                // Recherche de l'identifiant du destinataire
                $recipientId = null;
            
                foreach ($discussion->participants as $participant) {
                    // Vérification si l'ID du participant est différent de celui de l'utilisateur actuel
                    if (isset($participant['id']) && $participant['id'] !== $userId) {
                        $recipientId = $participant['id'];
                        break;
                    }
                }
            
                // Si aucun destinataire n'est trouvé, renvoyer une erreur
                if (!$recipientId) {
                    return response()->json([
                        'status_code' => 400,
                        'message' => 'Impossible de déterminer le destinataire de cette discussion privée.',
                    ], 400);
                }
            
                // Vérification de la relation entre les utilisateurs
                $contact = Contact::where(function ($query) use ($userId, $recipientId) {
                    $query->where('idUser1', $userId)->where('idUser2', $recipientId)
                          ->orWhere(function ($query) use ($userId, $recipientId) {
                              $query->where('idUser1', $recipientId)->where('idUser2', $userId);
                          });
                })->first();
            
                // Vérification des blocages et de l'existence de la relation
                if (!$contact || $contact->isBlockedUser1 || $contact->isBlockedUser2) {
                    return response()->json([
                        'status_code' => 403,
                        'message' => 'Vous ne pouvez pas envoyer de message car vous êtes bloqué ou la relation n\'existe pas.',
                    ], 403);
                }
            
                // Vérification de l'acceptation de la relation
                if (!$contact->isAccepted) {
                    return response()->json([
                        'status_code' => 403,
                        'message' => 'Vous devez être en contact avec cet utilisateur pour envoyer un message.',
                    ], 403);
                }
            }

            $message->text = $request->text;
            $message->updatedAt = now();
            $message->save();

            return response()->json([
                'status_code' => 200,
                'error' => false,
                'message' => 'Message modifié avec succès.',
                'data' => $message,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Une erreur est survenue lors de la modification du message.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Envoyer un fichier
     */
    public function sendFileMessage(Request $request)
    {
        try {

            // Validation
            $validator = Validator::make($request->all(), [
                'discussionId' => 'required',
                'file' => 'required|file|mimes:jpeg,png,pdf,docx|max:2048',
                'signalers' => 'nullable|array',
                'messageId' => 'nullable|exists:messages,_id',
            ],[
                'discussionId.required' => 'L\'identifiant de la discussion est requis.',
                'discussionId.exists' => 'La discussion spécifiée n\'existe pas.',
                'file.required' => 'Le fichier est requis.',
                'file.file' => 'Le fichier doit être un fichier valide.',
                'file.mimes' => 'Le fichier doit être de type : jpeg, png, pdf, ou docx.',
                'file.max' => 'La taille du fichier ne doit pas dépasser 2 Mo.',
                'signalers.array' => 'Le champ signalers doit être un tableau.',
                'messageId.exists' => 'Le message de référence spécifié n\'existe pas.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status_code' => 400,
                    'message' => 'Bad Request',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $userId = auth()->id();
            $discussion = Discussion::where('_id', $request->discussionId)->first();
                 
            // Vérification des droits
            $participant = collect($discussion->participants)->filter(function($participant) use ($userId) {
                return $participant['id'] == $userId;  // Utiliser un tableau associatif
            })->first();
            
            if (!$participant) {
                return response()->json([
                    'status_code' => 403,
                    'message' => 'Vous n\'êtes pas un participant de cette discussion.',
                ], 403);
            }
            
            if (in_array('DIFFUSION', $discussion->tags) && !$participant['isAdmin']) {
                return response()->json([
                    'status_code' => 403,
                    'message' => 'Seuls les administrateurs peuvent envoyer des messages dans une discussion de type DIFFUSION.',
                ], 403);
            }

            if ($discussion->tags === 'PRIVATE') {
                // Recherche de l'identifiant du destinataire
                $recipientId = null;
            
                foreach ($discussion->participants as $participant) {
                    // Vérification si l'ID du participant est différent de celui de l'utilisateur actuel
                    if (isset($participant['id']) && $participant['id'] !== $userId) {
                        $recipientId = $participant['id'];
                        break;
                    }
                }
            
                // Si aucun destinataire n'est trouvé, renvoyer une erreur
                if (!$recipientId) {
                    return response()->json([
                        'status_code' => 400,
                        'message' => 'Impossible de déterminer le destinataire de cette discussion privée.',
                    ], 400);
                }
            
                // Vérification de la relation entre les utilisateurs
                $contact = Contact::where(function ($query) use ($userId, $recipientId) {
                    $query->where('idUser1', $userId)->where('idUser2', $recipientId)
                          ->orWhere(function ($query) use ($userId, $recipientId) {
                              $query->where('idUser1', $recipientId)->where('idUser2', $userId);
                          });
                })->first();
            
                // Vérification des blocages et de l'existence de la relation
                if (!$contact || $contact->isBlockedUser1 || $contact->isBlockedUser2) {
                    return response()->json([
                        'status_code' => 403,
                        'message' => 'Vous ne pouvez pas envoyer de message car vous êtes bloqué ou la relation n\'existe pas.',
                    ], 403);
                }
            
                // Vérification de l'acceptation de la relation
                if (!$contact->isAccepted) {
                    return response()->json([
                        'status_code' => 403,
                        'message' => 'Vous devez être en contact avec cet utilisateur pour envoyer un message.',
                    ], 403);
                }
            }

            // Enregistrement du fichier
            $path = $request->file('file')->store('uploads/messages', 'public');

            // Création du message
            $message = new Message();
            $message->senderId = auth()->id();
            $message->discussionId = $request->discussionId;
            $message->file = [
                'path' => $path,
                'size' => $request->file('file')->getSize(),
                'ext' => $request->file('file')->getClientOriginalExtension(),
            ];
            $message->messageId = $request->messageId ?? null;
            $message->signalers = is_array($request->input('signalers')) ? $request->input('signalers') : [];
            $message->createdAt = now();
            $message->updatedAt = now();
            $message->save();

            return response()->json([
                'status_code' => 200,
                'error' => false,
                'message' => 'Fichier envoyé avec succès.',
                'data' => [
                    'file_url' => asset('storage/' . $path),
                    'message' => $message,
                ],
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Une erreur est survenue lors de l\'envoi du fichier.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Rechercher des messages
     */
    public function searchMessages(Request $request)
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'discussionId' => 'required',
                'keyword' => 'required|string',
            ], [
                'discussionId.required' => 'L\'identifiant de la discussion est requis.',
                'discussionId.exists' => 'La discussion spécifiée n\'existe pas.',
                'keyword.required' => 'Le mot-clé est requis.',
                'keyword.string' => 'Le mot-clé doit être une chaîne de caractères.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status_code' => 400,
                    'message' => 'Bad Request',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $userId = auth()->id();
            $discussion = Discussion::where('_id', $request->discussionId)->first();

            // Vérification des droits
            $participant = collect($discussion->participants)->filter(function($participant) use ($userId) {
                return $participant['id'] == $userId;  // Utiliser un tableau associatif
            })->first();
        
            if (!$participant) {
                return response()->json([
                    'status_code' => 403,
                    'message' => 'Vous n\'êtes pas un participant de cette discussion.',
                ], 403);
            }

            // Recherche des messages contenant le mot-clé
            $messages = Message::where('discussionId', $request->discussionId)
                ->where('text', 'like', '%' . $request->keyword . '%')
                ->get();

                if ($messages->isEmpty()) {
                    return response()->json([
                        'status_code' => 404,
                        'message' => 'Aucun message trouvé.',
                    ], 404);
                }    

            return response()->json([
                'status_code' => 200,
                'error' => false,
                'message' => 'Messages récupérés avec succès.',
                'data' => $messages,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Une erreur est survenue lors de la recherche.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Transférer un message
     */
    public function transferMessage(Request $request, Message $message)
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'discussionId' => 'required',
            ], [
                'discussionId.required' => 'L\'identifiant de la discussion cible est requis.',
                'discussionId.exists' => 'La discussion cible spécifiée n\'existe pas.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status_code' => 400,
                    'message' => 'Bad Request',
                    'errors' => $validator->errors(),
                ], 400);
            }

            if (!$message) {
                return response()->json([
                    'status_code' => 404,
                    'message' => 'Message non trouvé.',
                ], 404);
            }

            $userId = auth()->id();
            $discussion = Discussion::where('_id', $request->discussionId)->first();

            // Vérification des droits
            $participant = collect($discussion->participants)->filter(function ($participant) use ($userId) {
                return $participant['id'] == $userId;
            })->first();

            if (!$participant) {
                return response()->json([
                    'status_code' => 403,
                    'message' => 'Vous n\'êtes pas un participant de cette discussion.',
                ], 403);
            }
            
            // Gestion du fichier associé
            $newFilePath = null;
            if ($message->file) {
                $originalFilePath = $message->file['path']; // Chemin d'origine du fichier
                $newFilePath = 'path/to/clone/' . uniqid() . '.' . pathinfo($originalFilePath, PATHINFO_EXTENSION);
                // Créer une copie physique du fichier si elle existe
                
                if (Storage::disk('public')->exists($originalFilePath)) {
                    Storage::disk('public')->copy($originalFilePath, $newFilePath);
                } else {
                    return response()->json([
                        'status_code' => 404,
                        'message' => 'Fichier associé introuvable.',
                    ], 404);
                }
            }

            // Transférer le message
            $newMessage = new Message();
            $newMessage->senderId = $userId;
            $newMessage->discussionId = $request->discussionId;
            $newMessage->text = $message->text;
            $newMessage->messageId = $message->messageId;
            $newMessage->signalers = [];
            $newMessage->file = $newFilePath ? ['path' => $newFilePath] : null; // Associer le nouveau fichier
            $newMessage->save();

            return response()->json([
                'status_code' => 200,
                'error' => false,
                'message' => 'Message transféré avec succès.',
                'data' => $newMessage,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Une erreur est survenue lors du transfert du message.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Supprimer un message
     */
    public function deleteMessage(Message $message)
    {
        try {
            if (!$message) {
                return response()->json([
                    'status_code' => 404,
                    'message' => 'Message non trouvé.',
                ], 404);
            }

            if ($message->senderId !== auth()->id()) {
                return response()->json([
                    'status_code' => 403,
                    'message' => 'Vous n\'êtes pas autorisé à supprimer ce message.',
                ], 403);
            }

            // Suppression du fichier associé si présent
            if (!empty($message->file) && isset($message->file['path'])) {
                $filePath = storage_path('app/public/' . $message->file['path']);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }

            $message->delete();

            return response()->json([
                'status_code' => 200,
                'error' => false,
                'message' => 'Message supprimé avec succès.',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Une erreur est survenue lors de la suppression du message.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Signaler un message
     */
    public function reportMessage(Message $message)
    {
        try {
           
            if (!$message) {
                return response()->json([
                    'status_code' => 404,
                    'message' => 'Message non trouvé.',
                ], 404);
            }

            $userId = auth()->id();

            $signaler = in_array($userId, $message->signalers);        

            if ($signaler) {
                return response()->json([
                    'status_code' => 400,
                    'message' => 'Vous avez déjà signalé ce message.',
                ], 400);
            }

            $message->push('signalers', $userId);

            if (count($message->signalers) >= 5) {
                $message->delete();
                return response()->json([
                    'status_code' => 200,
                    'message' => 'Message supprimé en raison de multiples signalements.',
                ], 200);
            }

            return response()->json([
                'status_code' => 200,
                'error' => false,
                'message' => 'Message signalé avec succès.',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Une erreur est survenue lors du signalement du message.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
