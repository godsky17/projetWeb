<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApiResponse;
use App\Mail\RestPassword;
use App\Mail\WelcomeUser;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use Exception;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{

    /**
     * Vérifie l'authenticité d'un utilisateur via son token.
     *
     * Cette fonction récupère un utilisateur à partir de son ID et compare son token 
     * avec celui fourni dans l'en-tête de la requête.
     *
     * @param Request $request La requête HTTP contenant le token d'authentification.
     * @param string $id L'identifiant unique de l'utilisateur.
     * 
     * @return User|null Retourne l'utilisateur s'il est authentifié, sinon null.
     */
    private function verifyUser(Request $request, string $id)
    {
        try {

            $user = User::find($id);
            //dd($user);
            if (!$user) {
                return null;
            }

            $token = $request->header('Authorization');
            if ($token != null && str_starts_with($token, 'Bearer')) {
                $token = substr($token, 7);
            }

            if ($user->token != $token) {
                return null;
            }

            return $user;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Extrait et retourne le token Bearer de l'en-tête Authorization.
     *
     * Cette fonction récupère le token d'authentification envoyé dans l'en-tête HTTP
     * sous la forme "Bearer {token}" et retourne uniquement le jeton.
     *
     * @param Request $request La requête HTTP contenant l'en-tête Authorization.
     * 
     * @return string|null Retourne le token sans le préfixe "Bearer ", ou null s'il est absent.
     */
    private static function getToken($request)
    {
        $token = $request->header('Authorization');
        if ($token != null && str_starts_with($token, 'Bearer')) {
            $token = substr($token, 7);
        }
        return $token;
    }

    /**
     * Enregistre un nouvel utilisateur dans la base de données.
     *
     * Cette fonction valide les données reçues, crée un nouvel utilisateur avec un mot de passe haché,
     * génère un token de vérification, enregistre l'utilisateur en base et envoie un email de bienvenue.
     *
     * @param Request $request La requête HTTP contenant les informations de l'utilisateur.
     *
     * @return JsonResponse Retourne une réponse JSON avec le statut de la requête :
     *                      - 200 si l'utilisateur est créé avec succès.
     *                      - 400 en cas d'erreur de validation.
     *                      - 500 en cas d'erreur serveur.
     */
    public function register(Request $request)
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'identity.fullName' => 'required|string',
                'identity.bio' => 'nullable|string',
                'identity.picture' => 'nullable|url',
                'email' => 'required|email|unique:users,email',
                'username' => 'required|string|unique:users,username',
                'password' => 'required|min:6|confirmed',
            ], [
                'identity.fullName.required' => 'Le champ nom complet est obligatoire',
                'email.required' => 'Le champ email est obligatoire',
                'email.email' => 'Le champ email doit être une adresse email valide',
                'email.unique' => 'Cet email est déjà utilisé',
                'username.required' => 'Le champ nom d\'utilisateur est obligatoire',
                'username.required' => 'Le champ nom d\'utilisateur est obligatoire',
                'username.unique' => 'Ce nom d\'utilisateur est déjà utilisé',
                'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
                'password.min' => 'Le mot de passe doit contenir au moins 6 caractères',
            ]);

            // Vérification des erreurs de validation
            if ($validator->fails()) {
                return response()->json([
                    'status_code' => 400,
                    'message' => 'Bad Request, Veuillez bien remplir le formulaire svp.',
                    'errors' => $validator->errors(),
                ], 400);
            }

            // Création de l'utilisateur
            $user = new User();
            $user->identity = [
                'fullName' => $request->input('identity.fullName'),
                'bio' => $request->input('identity.bio', ''),
                'picture' => $request->input('identity.picture', null),
            ];
            $user->email = $request->input('email');
            $user->username = $request->input('username');
            $user->isOnLine = false; // Par défaut, l'utilisateur n'est pas en ligne   
            $user->isActivated = true; // Par défaut, l'utilisateur est activé 
            $user->password = Hash::make($request->input('password'), [
                'rounds' => 12,
            ]);
            $user->verifyAd = null;
            $user->verifyToken = Str::random(60);
            $user->tokenExpiredAt = null;
            $user->tokenExpiredAt = null;
            $user->save();
            // Envoie de mail
            Mail::to($user->email)->send(
                new WelcomeUser(
                    $user->email,
                    $request->input('identity.fullName'),
                    $user->verifyToken
                )
            );

            return response()->json([
                'status_code' => 200,
                'error' => false,
                'message' => 'Utilisateur créé avec succès',
                'data' => $user,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status_code' => 500,
                'message' => 'Une erreur est survenue',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Méthode permettant de vérifier l'email d'un utilisateur via un token de vérification.
     *
     * Cette méthode recherche un utilisateur en fonction du token de vérification envoyé dans la requête.
     * Si l'utilisateur existe et que le token est valide, son champ `verifyAd` (date de vérification de l'email) est mis à jour avec la date et l'heure actuelles.
     * Si l'utilisateur n'est pas trouvé ou si le token est invalide, une erreur est renvoyée.
     *
     * @param Request $request La requête HTTP contenant le token de vérification dans les paramètres.
     * 
     * @return \Illuminate\Http\JsonResponse La réponse JSON indiquant si la vérification a été réussie ou échouée.
     * 
     * @throws \Exception Si une erreur se produit lors de la recherche ou de la mise à jour de l'utilisateur.
     */
    public function verifyEmail(Request $request)
    {
        try {
            $user = User::where('verifyToken', $request->token)->first();
            if (!$user) {
                return response()->json([
                    'message' => 'Pas d\'acces',
                ]);
            }

            $user->verifyAd = now();
            $user->save();

            return ApiResponse::success();
        } catch (\Exception $e) {
            return response()->json([
                'status_code' => 400,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Méthode permettant à un utilisateur de se connecter en utilisant son email et son mot de passe.
     *
     * Cette méthode valide les informations d'identification de l'utilisateur (email et mot de passe) et génère un token d'authentification si les identifiants sont corrects.
     * Si l'authentification réussit, un token est renvoyé, ainsi que les informations de l'utilisateur. Le statut `isOnLine` de l'utilisateur est mis à jour à `true`.
     * En cas d'échec, une erreur est renvoyée pour indiquer que l'email ou le mot de passe est incorrect.
     *
     * @param Request $request La requête HTTP contenant les informations d'identification de l'utilisateur (email et mot de passe).
     * 
     * @return \Illuminate\Http\JsonResponse La réponse JSON contenant le token et les informations de l'utilisateur si l'authentification est réussie.
     * 
     * @throws \Illuminate\Validation\ValidationException Si les informations d'identification ne sont pas valides (email et mot de passe requis).
     */
    public function login(Request $request)
    {
        try {
            // Validation des entrées
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ], [
                'email.required' => "Email est requis"
            ]);

            if ($validator->fails()) {
                return ApiResponse::validation($validator->errors());
            }

        // Préparer les identifiants pour l'authentification
        $credentials = $request->only('email', 'password');

        // Essayer de générer un token
        if (!$token = Auth::attempt($credentials)) {
            return ApiResponse::error("Error", ["email" => "Email ou mot de passe incorrect."], 401);
        }

        Auth::user()->isOnLine = true;
        Auth::user()->save();
        return ApiResponse::success(['token' => $token, "user" => Auth::user()], "Connexion réussie.");
        } catch (\Exception $e) {
            return ApiResponse::error("Une erreur s'est produite", $e->getMessage());
        }
    }


    /**
     * Méthode permettant à un utilisateur de se déconnecter de l'application.
     *
     * Cette méthode déconnecte l'utilisateur en révoquant son token d'authentification et met à jour son statut `isOnLine` à `false`.
     * En cas de succès, un message de déconnexion réussie est renvoyé. En cas d'erreur, un message d'erreur est retourné.
     * 
     * @return \Illuminate\Http\JsonResponse La réponse JSON indiquant si la déconnexion a réussi ou non.
     *
     * @throws \Exception Si une erreur se produit lors de la déconnexion.
     */
    public function logout()
    {
        try {
            Auth::logout();
            Auth::user()->isOnLine = false;
            Auth::user()->save();
            return ApiResponse::success(null, "Déconnexion réussie");
        } catch (\Exception $e) {
            return ApiResponse::error("Erreur lors de la déconnexion.", null, 500);
        }
    }

    /**
     * Méthode permettant de mettre à jour les informations du profil de l'utilisateur.
     *
     * Cette méthode permet à un utilisateur de mettre à jour ses informations personnelles telles que son nom complet, sa bio et sa photo de profil.
     * Elle valide les données d'entrée, met à jour le profil de l'utilisateur authentifié, et génère un nouveau token d'authentification.
     *
     * @param \Illuminate\Http\Request $request Les données envoyées par le client pour la mise à jour du profil.
     * 
     * @return \Illuminate\Http\JsonResponse La réponse JSON avec le message de succès ou d'erreur.
     *
     * @throws \Exception Si une erreur se produit pendant la mise à jour du profil.
     */
    public function updateUserProfileInfos(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'identity.fullName' => 'required|string|max:255',
                'identity.bio' => 'nullable|string',
                'identity.picture' => 'nullable|url',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validation($validator->errors());
            }

            $user = Auth::user();
            $user->identity = array_merge($user->identity, [
                'fullName' => $request->input('identity.fullName'),
                'bio' => $request->input('identity.bio', ''),
                'picture' => $request->input('identity.picture', null),
            ]);
            $user->save();
            $token = auth()->refresh();;

            return ApiResponse::success(["token" => $token, "user" => Auth::user()], "Profil mis à jour avec succès");
        } catch (Exception $e) {
            return ApiResponse::error("Une erreur est survenue.", $e->getMessage(), 500);
        }
    }

    /**
     * Méthode permettant de mettre à jour le mot de passe de l'utilisateur.
     *
     * Cette méthode permet à un utilisateur authentifié de modifier son mot de passe en vérifiant d'abord que le mot de passe actuel
     * est correct. Si c'est le cas, elle remplace le mot de passe existant par un nouveau mot de passe, et génère un nouveau token d'authentification.
     *
     * @param \Illuminate\Http\Request $request Les données envoyées par le client, contenant le mot de passe actuel et le nouveau mot de passe.
     * 
     * @return \Illuminate\Http\JsonResponse La réponse JSON avec le message de succès ou d'erreur.
     *
     * @throws \Illuminate\Validation\ValidationException Si les données ne respectent pas les règles de validation.
     */
    public function updateUserPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }


        if (Hash::check($request->input('current_password'), Auth::user()->password)) {
            Auth::user()->password = Hash::make($request->input('new_password'));
            Auth::user()->save();
            $token = UserController::getToken($request);
            return ApiResponse::success([
                "token" => $token,
                "user" => Auth::user()
            ], "Mot de passe modifié.");
        }

        return ApiResponse::error("Le mot de passe actuel est incorrect", null, 400);
    }

    /**
     * Méthode permettant renvoyer le liens pour la validation de son compte.
     *
     * Cette méthode génère un nouveau token de vérification pour l'utilisateur,
     * et envoie un email contenant le lien de verification. Le lien contient le token de vérification.
     *
     * @param \Illuminate\Http\Request $request Les données envoyées par le client, contenant la token.
     *
     * @return \Illuminate\Http\JsonResponse La réponse JSON avec le message de succès ou d'erreur.
     *
     * @throws \Illuminate\Validation\ValidationException Si l'email n'est pas fourni ou est mal formé.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException Si l'utilisateur avec l'email donné n'est pas trouvé.
     */
    public function sendResetLink(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
            ]);
            $user = User::where('verifyToken', $request->token)->first();
            if(!$user) {
                return ApiResponse::error('Utilisateur non trouve', $user);
            }
            $user->verifyToken = Str::random(60);
            $user->save();
            Mail::to($user->email)->send(
                new WelcomeUser(
                    $user->email,
                    $request->input('identity.fullName'),
                    $user->verifyToken
                )
            );

            return ApiResponse::success(null, "Email de verification renvoyer avec succes");
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), null, 500);
        }
    }


    /**
     * Méthode permettant de réinitialiser le mot de passe d'un utilisateur.
     *
     * Cette méthode génère un nouveau token de vérification et l'envoie par email à l'utilisateur spécifié.
     * Le lien dans l'email contient ce token pour permettre à l'utilisateur de réinitialiser son mot de passe.
     *
     * @param \Illuminate\Http\Request $request Les données envoyées par le client, contenant l'email de l'utilisateur.
     *
     * @return \Illuminate\Http\JsonResponse La réponse JSON avec un message de succès ou d'erreur.
     *
     * @throws \Illuminate\Validation\ValidationException Si l'email n'est pas fourni ou est mal formé.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException Si l'utilisateur avec l'email donné n'est pas trouvé.
     */
    public function resetPassword(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return ApiResponse::error("Utilisateur invalid", null, 401);
            }
            $user->verifyAd = Str::random(60);
            $user->save();
            Mail::to($user->email)->send(new RestPassword(
                $user->email,
                $user->identity['fullName'],
                $user->verifyAd
            ));

            return ApiResponse::success(null, "Email de verification renvoyer avec succes");
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), null, 500);
        }
    }

    // TODO : Fix this fonctionnality 
    public function updateProfilePicture(Request $request, string $id)
    {
        dd($id, $request->all());
        // Validation de l'image
        $validator = Validator::make($request->all(), [
            'profile_picture' => ['required', 'image', 'mimes:jpg,png', 'max:5120'], // 5 Mo = 5120 Ko
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = $this->verifyUser($request, $id);
    }

    /**
     * Méthode permettant de désactiver le compte d'un utilisateur.
     *
     * Cette méthode désactive le compte de l'utilisateur en vérifiant le mot de passe fourni. 
     * Si le mot de passe est valide, elle marque l'utilisateur comme non activé et le déconnecte.
     *
     * @param \Illuminate\Http\Request $request Les données envoyées par le client, contenant le mot de passe de l'utilisateur.
     *
     * @return \Illuminate\Http\JsonResponse La réponse JSON avec un message de succès ou d'erreur.
     *
     * @throws \Illuminate\Validation\ValidationException Si le mot de passe n'est pas fourni.
     * @throws \Illuminate\Auth\AuthenticationException Si le mot de passe est incorrect.
     */
    public function desactivateAccount(Request $request)
    {
        // Validation des données entrées par l'utilisateur
        $validator = Validator::make($request->all(), [
            'password' => ['required'],
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Impossible d\'effectuer cette action', $validator->errors(), 500);
        }

        if (!Hash::check($request->password, Auth::user()->password)) {
            return ApiResponse::error('Impossible d\'effectuer cette action', null, 500);
        };

        try {
            Auth::user()->isActivated = false;
            Auth::user()->isOnLine = false;
            Auth::user()->save();
            Auth::logout();

            return ApiResponse::success(Auth::user(), "Compte desactiver");
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), "Une erreur s'est produite", 500);
        }
    }

    /**
     * Méthode permettant de récupérer les informations de l'utilisateur actuellement connecté.
     *
     * Cette méthode retourne les détails de l'utilisateur authentifié, y compris son profil
     * et un nouveau token d'authentification. 
     *
     * @param \Illuminate\Http\Request $request Les données envoyées par le client.
     *
     * @return \Illuminate\Http\JsonResponse La réponse JSON contenant les informations de l'utilisateur et un nouveau token.
     *
     * @throws \Throwable Si une erreur imprévue se produit pendant le traitement de la requête.
     */
    public function me(Request $request)
    {
        try {
            return ApiResponse::success([
                'user' => Auth::user(),
                'token' => UserController::getToken($request),
            ]);
        } catch (\Throwable $e) {
            return ApiResponse::error($e->getMessage());
        }
    }
}
