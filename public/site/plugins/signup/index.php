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

          if (isset($mc_data['pilot'])) {
            $interest = ['9dac282576' => true];
          } else {
            $interest = ['9dac282576' => false];
          };

          // mc subscribe new user
          $response = $mc->post('lists/' . $mc_listid . '/members', [
            'email_address' => $mc_data['email'],
            'merge_fields' => (object) $mc_fields,
            'interests' => $interest,
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
