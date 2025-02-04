<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApiResponse extends JsonResource
{
    protected $status;
    protected $message;
    protected $data;
    protected $statusCode;
    protected $errors;

    public function __construct()
    {
        $this->status = 'success';
        $this->message = null;
        $this->data = null;
        $this->statusCode = 200;
        $this->errors = null;
    }

    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    public function setData($data)
    {
        $this->data = $data;
        return $this;
    }

    public function setStatusCode($code)
    {
        $this->statusCode = $code;
        return $this;
    }

    public function setErrors($errors)
    {
        $this->errors = $errors;
        return $this;
    }

    public function send()
    {
        $response = [
            'status' => $this->status,
            'message' => $this->message,
            'data' => $this->data,
            'timestamp' => now(),
            'errors' => $this->errors
        ];

        return response()->json($response, $this->statusCode);
    }

    public static function success($data = null, $message = 'Success')
    {
        return (new self())
            ->setStatus('success')
            ->setMessage($message)
            ->setData($data)
            ->setStatusCode(200)
            ->send();
    }

    public static function error($message = 'Error', $errors = null, $code = 400)
    {
        return (new self())
            ->setStatus('error')
            ->setMessage($message)
            ->setErrors($errors)
            ->setStatusCode($code)
            ->send();
    }

    public static function validation($errors, $message = 'Validation Error')
    {
        return (new self())
            ->setStatus('error')
            ->setMessage($message)
            ->setErrors($errors)
            ->setStatusCode(422)
            ->send();
    }
}
