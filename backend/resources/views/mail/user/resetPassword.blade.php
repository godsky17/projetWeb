<x-mail::message>
# Introduction

Pour modifier votre mot de passe {{$name}}, veuillez clicker surle boutton ci dessus.

<x-mail::button :url="$url">
Modifier mot de passe
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
