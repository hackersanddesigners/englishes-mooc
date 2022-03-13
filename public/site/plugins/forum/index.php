<?php

Kirby::plugin('mooc/forum', [
  'routes' => [
    [
      // get_posts
      
      'method' => 'POST',
      'pattern' => '/apipost',
      'action' => function () {
        $data = r::data();

        if (array_key_exists('cat_id', $data) AND array_key_exists('username', $data)) {
          $cat_id = $data['cat_id'];
          $usr_name = $data['username'];

          $usr = page('forum-users')->users()->toStructure()->findBy('user', $usr_name);
          $result = [];

          if ($usr !== null) {
            $usr_key = $usr->key();
            $url_root = 'https://forum.englishes-mooc.org/';
            $url = $url_root . 'c/'. $cat_id . '.json?';

            $request = Remote::get($url, [
              'headers' => [
                "Content-Type: application/json;",
                "Api-Key: $usr_key",
                "Api-Username: $usr_name"
			        ]
            ]);

            if ($request->code() === 200) {
              $result = $request->json();
            }
          } else {
            $result = ['error' => 'wrong wrong'];
          }

          return $result;
        } else {
          return ['error' => 'missing login info'];
        }
      }
    ],
    [
      // get_topic
      
      'method' => 'POST',
      'pattern' => '/apitopic',
      'action' => function () {
        $data = r::data();

        $topic_id = $data['topic_id'];
        $usr_name = $data['username'];
        $usr_key = page('forum-users')->users()->toStructure()->findBy('user', $usr_name)->key();

        $url_root = 'https://forum.englishes-mooc.org/';
        $url = $url_root . 't/' . $topic_id . '.json';

        $result = [];
        $request = Remote::get($url, [
          'headers' => [
            "Content-Type: application/json;",
            "Api-Key: $usr_key",
            "Api-Username: $usr_name"
          ]
        ]);

        if ($request->code() === 200) {
          $result = $request->json();
        };

        return $result;
      }
    ],
    [
      // login
      
      'method' => 'POST',
      'pattern' => '/api-login',
      'action' => function () {
        $data = r::data();

        $usr_name = $data['username'];
        $usr_pw = $data['pw']; 

        try {
            $usr = page('forum-users')->users()->toStructure()->findBy('user', $usr_name);
            $result = [];

            // curl -X POST https://forum.englishes-mooc.org/session? \
            // --data "login=cycle.four&password=rabid-proofs-underarm-hubcap-cheating-heftiness-gilled" \
            // -H "Content-Type: multipart/form-data;" \
            // -H "Api-Key: <key>" \
            // -H "Api-Username: <usr_name>"

            if ($usr !== null) {
                $usr_key = $usr->key();
                $url_root = 'https://forum.englishes-mooc.org/';
                $url = $url_root . 'session?login=' . $usr_name . '&password=' . $usr_pw;

                $request = Remote::post($url, [
                    'headers' => [
                        "Content-Type: multipart/form-data;",
                        "Api-Key: $usr_key",
                        "Api-Username: $usr_name"
                    ]
                ]);

                if ($request->code() === 200) {
                    $result = $request->json();
                }

            } else {
                $result = ['error' => 'Check your username and / or password'];
            }

            return $result;

        } catch (Exception $error) {
            $result = ['error' => 'Check your username and / or password'];
        }
      }
    ],
    [
      // logout
      
      'method' => 'POST',
      'pattern' => 'api-logout',
      'action' => function () {
        $data = r::data();

        // to logout from the forum, we need:
        // - the id of the user we want to logout
        // - the system's username and api key

        $usr_id = $data['user_id'];
        $usr_name = page('forum-users')->users()->toStructure()->findBy('user', 'system')->user();
        $usr_key = page('forum-users')->users()->toStructure()->findBy('user', 'system')->key();

        $url_root = 'https://forum.englishes-mooc.org/';
        $url = $url_root . 'admin/users/' . $usr_id . '/log_out?';
        $result = [];
        $request = Remote::post($url, [
          'headers' => [
            "Content-Type: multipart/form-data;",
            "Api-Key: $usr_key",
            "Api-Username: $usr_name"
          ]
        ]);
        $result = $request->json();

        return $result;
      }
    ],
    [
      // post_write
      
      'method' => 'POST',
      'pattern' => 'api-post-msg',
      'action' => function () {
        $data = r::data();

        $title = $data['title'];
        $disc_tab = $data['disc_tab'];
        $disc_id = $data['disc_id'];
        /* $ass_id = $data['ass_id']; */
        $msg = $data['raw'];
        $usr_name = $data['username'];
        $usr_key = page('forum-users')->users()->toStructure()->findBy('user', $usr_name)->key();

        $url_root = 'https://forum.englishes-mooc.org/';

        $url = $url_root . 'posts.json?&title=' . $title . "'&topic_id=" . $disc_id . '&raw=' . $msg;

        $result = [];
        $request = Remote::post($url, [
          'headers' => [
            "Content-Type: application/json;",
            "Api-Key: $usr_key",
            "Api-Username: $usr_name"
          ]
        ]);
        $result = $request->json();

        return $result;
      }
    ],
    [
      // post_delete
      
      'method' => 'POST',
      'pattern' => 'apimsgdel',
      'action' => function () {
        $data = r::data();

        $post_id = $data['id'];
        $usr_name = $data['username'];
        $usr_key = page('forum-users')->users()->toStructure()->findBy('user', $usr_name)->key();

        $url_root = 'https://forum.englishes-mooc.org/';

        // url: `${url_root}/posts/${opts.id}?api_key=${opts.user_k}&api_username=${opts.user_v}`,

        $url = $url_root . 'posts/' . $post_id;


        $result = [];
        $request = Remote::delete($url, [
          'headers' => [
            "Content-Type: application/json;",
            "Api-Key: $usr_key",
            "Api-Username: $usr_name"
          ]
        ]);
        $result = $request->json();

        return $result;
      }
    ]
  ]
]);
