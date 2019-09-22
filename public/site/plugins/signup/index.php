<?php

use \DrewM\MailChimp\MailChimp;
require('vendor/autoload.php');

Kirby::plugin('mooc/signup', [
  'routes' => [
    [
      'method' => 'POST',
      'pattern' => 'apisignup',
      'action' => function () {
        if(r::is('POST')) {
          $mc_data = r::data();

          // mailchimp api
          $mc_apikey = page('signup')->apikey();
          $mc_listid = page('signup')->listid();

          $mc = new MailChimp($mc_apikey); 

          $mc_fields = [ 'MMERGE1' => $mc_data['name'], 'MMERGE3' => $mc_data['info']];

          $interests = [];
          if (isset($mc_data['cycle_2019-10'])) {
            $interests['02f4f0ff05'] = true;
          } else {
            $interests['02f4f0ff05'] = false;
          };

          if (isset($mc_data['cycle_2020-02'])) {
            $interests['b10fa8aea6'] = true;
          } else {
            $interests['b10fa8aea6'] = false;
          };

          // mc subscribe new user
          $response = $mc->post('lists/' . $mc_listid . '/members', [
            'email_address' => $mc_data['email'],
            'merge_fields' => (object) $mc_fields,
            'interests' => $interests,
            'status' => 'pending',
            'double_optin' => false,
            'update_existing' => true,
            'send_welcome' => false
          ]);

          return response::json($response);
        }
      }
    ]
  ]
]);
