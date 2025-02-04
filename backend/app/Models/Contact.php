<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Contact extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'contacts';

    protected $fillable = [
        'idUser1', 'idUser2', 'isBlockedUser1',
        'isBlockedUser2', 'isAccepted',
    ];
}
