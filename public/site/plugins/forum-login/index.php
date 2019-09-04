<?php

Kirby::plugin('mooc/forumlogin', [
  'routes' => [
    [
      'method' => 'POST',
      'pattern' => 'apilogin',
      'action' => function () {
        $data = r::data();

        $usr_name = $data['name'];
        $usr_pw = $data['pw'];

        $user = page('forum-users')->users()->toStructure()->filter(function ($usr) {
          return $usr->user() == 'guest'; 
        });
        $usr_key = $user->first()->key();

        $url = 'https://forum.englishes-mooc.org/session?api_key=' . $usr_key . '&api_username=' . $usr_name . '&login=' . $usr_name . '&password=' . $usr_pw;
        $result = [];
        $request = Remote::post($url);
        $result = $request->json();

        return $result;
      }
    ]
  ]
]);
