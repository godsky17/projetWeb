<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // Rechercher un contact
    public function searchContacts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:3',
        ], [
            'query.required' => 'Le champ de recherche est requis.',
            'query.min' => 'La recherche doit contenir au moins 3 caractères.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status_code' => 400,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 400);
        }

        $results = User::where('username', 'like', '%' . $request->input('query') . '%')->get();

        return response()->json([
            'status_code' => 200,
            'message' => 'Résultats de recherche obtenus.',
            'data' => $results,
        ]);
    }


    /**
     * Méthode permettant à un utilisateur d'envoyer une demande de contact à un autre utilisateur.
     *
     * Cette méthode vérifie si une demande de contact existe déjà entre les deux utilisateurs et 
     * empêche l'envoi d'une nouvelle demande en cas de relation existante ou en attente. 
     * Si la validation est réussie et qu'aucune demande de contact n'existe, une nouvelle 
     * demande est enregistrée dans la base de données.
     *
     * @param Request $request La requête HTTP contenant l'identifiant de l'utilisateur cible.
     *
     * @return \Illuminate\Http\JsonResponse La réponse JSON indiquant le succès ou l'échec de la requête.
     *
     * @throws \Illuminate\Validation\ValidationException Si l'identifiant de l'utilisateur cible est absent ou invalide.
     */
    public function sendContactRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            //'idUser2' => 'required|exists:users,id', rigth code
            'idUser2' => 'required', // Lazy code
        ], [
            'idUser2.required' => 'L\'identifiant de l\'utilisateur est requis.',
            'idUser2.exists' => 'L\'utilisateur spécifié n\'existe pas.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status_code' => 400,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 400);
        }

        $existingContact = Contact::where(function ($query) use ($request) {
            $query->where('idUser1', auth()->id())
                ->where('idUser2', $request->idUser2)
                ->orWhere(function ($query) use ($request) {
                    $query->where('idUser1', $request->idUser2)
                        ->where('idUser2', auth()->id());
                });
        })->first();

        if ($existingContact) {
            return response()->json([
                'status_code' => 400,
                'message' => 'Vous êtes déjà en contact avec cet utilisateur ou une demande est en attente.',
            ], 400);
        }
        $contact = new Contact();
        $contact->idUser1 = auth()->id();
        $contact->idUser2 = $request->idUser2;
        $contact->isBlockedUser1 = false;
        $contact->isBlockedUser2 = false;
        $contact->isAccepted = false;
        $contact->save();

        return response()->json([
            'status_code' => 201,
            'message' => 'Demande de contact envoyée avec succès.',
            'data' => $contact,
        ], 201);
    }


    /**
     * Méthode permettant à un utilisateur d'accepter une demande de contact reçue.
     *
     * Seul l'utilisateur destinataire de la demande (idUser2) peut l'accepter. 
     * Une fois acceptée, la demande de contact est mise à jour avec le statut `isAccepted = true`.
     *
     * @param Contact $contact L'objet représentant la demande de contact à accepter.
     * 
     * @return \Illuminate\Http\JsonResponse La réponse JSON confirmant l'acceptation de la demande 
     * ou une erreur si l'utilisateur n'a pas les permissions nécessaires.
     * 
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si l'utilisateur n'a pas la permission d'accepter la demande.
     */
    public function acceptContactRequest(Contact $contact)
    {
        if ($contact->idUser2 !== auth()->id()) {
            return response()->json([
                'status_code' => 403,
                'message' => 'Vous n\'avez pas la permission d\'accepter cette demande.',
            ], 403);
        }

        $contact->isAccepted = true;
        $contact->save();

        return response()->json([
            'status_code' => 200,
            'message' => 'Demande de contact acceptée.',
            'data' => $contact,
        ], 200);
    }


    /**
     * Méthode permettant à un utilisateur de refuser une demande de contact reçue.
     *
     * Seul l'utilisateur destinataire de la demande (idUser2) peut la refuser. 
     * Lorsqu'une demande est refusée, elle est définitivement supprimée de la base de données.
     *
     * @param Contact $contact L'objet représentant la demande de contact à refuser.
     * 
     * @return \Illuminate\Http\JsonResponse La réponse JSON confirmant le refus de la demande 
     * ou une erreur si l'utilisateur n'a pas les permissions nécessaires.
     * 
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException Si l'utilisateur n'a pas la permission de refuser la demande.
     */
    public function rejectContactRequest(Contact $contact)
    {
        if ($contact->idUser2 !== auth()->id()) {
            return response()->json([
                'status_code' => 403,
                'message' => 'Vous n\'avez pas la permission de refuser cette demande.',
            ], 403);
        }

        $contact->delete();

        return response()->json([
            'status_code' => 200,
            'message' => 'Demande de contact refusée.',
        ], 200);
    }


    /**
     * Méthode permettant de récupérer la liste des demandes de contact reçues par l'utilisateur authentifié.
     *
     * Cette méthode renvoie toutes les demandes de contact en attente (non encore acceptées) adressées à l'utilisateur connecté.
     *
     * @return \Illuminate\Http\JsonResponse La réponse JSON contenant la liste des demandes de contact reçues.
     */
    public function listReceivedRequests()
    {
        $requests = Contact::where('idUser2', auth()->id())->where('isAccepted', false)->get();

        return response()->json([
            'status_code' => 200,
            'message' => 'Liste des demandes de contact reçues.',
            'data' => $requests,
        ]);
    }


    /**
     * Méthode permettant à un utilisateur de bloquer un contact.
     *
     * Cette méthode vérifie si l'utilisateur authentifié fait partie du contact spécifié et lui permet de bloquer l'autre utilisateur.
     * Le blocage est appliqué du côté de l'utilisateur qui effectue l'action.
     *
     * @param Contact $contact L'instance du contact à bloquer.
     * 
     * @return \Illuminate\Http\JsonResponse La réponse JSON confirmant le blocage du contact ou une erreur si l'utilisateur n'a pas la permission.
     */
    public function blockContact(Contact $contact)
    {
        if ($contact->idUser1 !== auth()->id() && $contact->idUser2 !== auth()->id()) {
            return response()->json([
                'status_code' => 403,
                'message' => 'Vous n\'avez pas la permission de bloquer ce contact.',
            ], 403);
        }

        if ($contact->idUser1 === auth()->id()) {
            $contact->isBlockedUser1 = true;
        } else {
            $contact->isBlockedUser2 = true;
        }

        $contact->save();

        return response()->json([
            'status_code' => 200,
            'message' => 'Contact bloqué avec succès.',
            'data' => $contact,
        ]);
    }


    /**
     * Récupère la liste des contacts établis de l'utilisateur authentifié.
     *
     * Cette méthode retourne les contacts où l'utilisateur est impliqué et où la demande a été acceptée.
     *
     * @return \Illuminate\Http\JsonResponse Réponse JSON contenant la liste des contacts établis.
     */
    public function listEstablishedContacts()
    {
        $contacts = Contact::where(function ($query) {
            $query->where('idUser1', auth()->id())
                ->orWhere('idUser2', auth()->id());
        })->where('isAccepted', true)->get();

        return response()->json([
            'status_code' => 200,
            'message' => 'Liste des contacts établis.',
            'data' => $contacts,
        ]);
    }


    /**
     * Supprime un contact de la liste de l'utilisateur authentifié.
     *
     * Cette méthode permet à un utilisateur de supprimer un contact s'il est impliqué dans cette relation.
     *
     * @param Contact $contact Le contact à supprimer.
     * @return \Illuminate\Http\JsonResponse Réponse JSON confirmant la suppression ou une erreur de permission.
     */
    public function deleteContact(Contact $contact)
    {
        if ($contact->idUser1 !== auth()->id() && $contact->idUser2 !== auth()->id()) {
            return response()->json([
                'status_code' => 403,
                'message' => 'Vous n\'avez pas la permission de supprimer ce contact.',
            ], 403);
        }

        $contact->delete();

        return response()->json([
            'status_code' => 200,
            'message' => 'Contact supprimé avec succès.',
        ]);
    }
}
