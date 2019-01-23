<?php

Kirby::plugin('mooc/signup', [
  'routes' => [
    [
      'method' => 'POST',
      'pattern' => 'apisignup',
      'action' => function () {
        if(r::is('POST')) {
          $data = r::data();

          $kirby = kirby();

          try {
            $kirby->email([
              'from' => 'info@englishes-mooc.org',
              'to' => $data['email'],
              'subject' => 'Welcome!',
              'body'=> 'It\'s great to have you with us',
            ]);
          } catch (Exception $error) {
            echo $error;
          }

          return response::json($data);
        }
      }
    ]
  ]
]);
