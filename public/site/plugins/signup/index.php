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
          if (isset($mc_data['2019-cycle-10'])) {
            $interests['02f4f0ff05'] = true;
          } else {
            $interests['02f4f0ff05'] = false;
          };

          if (isset($mc_data['cycle-2020-02'])) {
            $interests['b10fa8aea6'] = true;
          } else {
            $interests['b10fa8aea6'] = false;
          };

          if (isset($mc_data['cycle-2020-spring'])) {
            $interests['badb42eca0'] = true;
          } else {
            $interests['badb42eca0'] = false;
          };

          if (isset($mc_data['cycle-2020-summer'])) {
            $interests['6bc04ec0a3'] = true;
          } else {
            $interests['6bc04ec0a3'] = false;
          };

          if (isset($mc_data['cycle-spring-2021'])) {
            $interests['faac8a2345'] = true;
          } else {
            $interests['faac8a2345'] = false;
          };

          if (isset($mc_data['cycle-spring-summer-2022'])) {
              $interests['67797da770'] = true;
          } else {
              $interests['67797da770'] = false;
          };

          if (isset($mc_data['cycle-autumn-winter-2022-3'])) {
              $interests['95a5517a94'] = true;
          } else {
              $interests['95a5517a94'] = false;
          };

          // mc subscribe new user
          $response = $mc->post('lists/' . $mc_listid . '/members', [
            'email_address' => $mc_data['email'],
            'merge_fields' => (object) $mc_fields,
            'interests' => $interests,
            'tags' => [$mc_data['tag']],
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
