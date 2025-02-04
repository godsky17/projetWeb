<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Discussion extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'discussions';

    protected $fillable = [
        'id','tags', 'participants', 'name', 'description', 'picture', 
        'createdAt', 'createdBy',
    ];

    protected $casts = [
        'createdAt' => 'datetime',
    ];
}
