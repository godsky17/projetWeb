<x-mail::message>
# Introduction

Bienvenu sur ChatApp {{$name}}

<x-mail::button :url="$url">
Button Text
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
