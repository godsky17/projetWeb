<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exportation de la Discussion</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 0;
            font-size: 14px;
            color: gray;
        }
        .message {
            margin-bottom: 20px;
            padding: 10px;
            border-bottom: 1px solid #ccc;
        }
        .message strong {
            color: #007BFF;
        }
        .file {
            margin-top: 10px;
        }
        .file img {
            max-width: 100%;
            height: auto;
            display: block;
            margin-top: 5px;
        }
        .file a {
            font-size: 14px;
            color: #007BFF;
            text-decoration: none;
        }
        .cloned-message {
            font-style: italic;
            color: gray;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Nom de la discussion : {{ $discussion->name }}</h1>
        <p>Description : {{ $discussion->description }}</p>
    </div>

    <div>
        @foreach ($messages as $message)
            <div class="message">
                <strong>{{ $message->user->username ?? 'Utilisateur inconnu' }} :</strong> 
                {{ $message->text ?? 'Pas de texte.' }}

                {{-- Afficher le fichier si présent --}}
                @if ($message->file)
                    <div class="file">
                        @if (!empty($message->file['path']))
                            <img src="{{ public_path('storage/' . $message->file['path']) }}" width="100" alt="Image attachée">
                        @else
                            <p>Aucune image attachée.</p>
                        @endif
                    </div>
                @endif
            </div>
        @endforeach
    </div>
</body>
</html>
