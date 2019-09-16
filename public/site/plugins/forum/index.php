<?php

Kirby::plugin('mooc/forum', [
  'routes' => [
    [
      // get_posts
      
      'method' => 'POST',
      'pattern' => '/apipost',
      'action' => function () {
        $data = r::data();

        $cat_id = $data['cat_id'];
        $usr_name = $data['user'];

        // add if-clause?
        $usr_key = page('forum-users')->users()->toStructure()->findBy('user', $usr_name)->key();

        $url_root = 'https://forum.englishes-mooc.org/';
        $url = $url_root . 'c/'. $cat_id . '.json?api_key=' . $usr_key . '&api_username=' . $usr_name;

        $result = [];
        $request = Remote::get($url);
        $result = $request->json();

        return $result;
      }
    ],
    [
      // get_topic
      
      'method' => 'POST',
      'pattern' => '/apitopic',
      'action' => function () {
        $data = r::data();

        $topic_id = $data['topic_id'];
        $usr_name = $data['user'];
        $usr_key = page('forum-users')->users()->toStructure()->findBy('user', $usr_name)->key();

        $url_root = 'https://forum.englishes-mooc.org/';
        $url = $url_root . 't/' . $topic_id . '.json?api_key=' . $usr_key . '&api_username=' . $usr_name;

        $result = [];
        $request = Remote::get($url);
        $result = $request->json();

        return $result;
      }
    ],
    [
      // login
      
      'method' => 'POST',
      'pattern' => '/apilogin',
      'action' => function () {
        $data = r::data();

        $usr_name = $data['name'];
        $usr_pw = $data['pw'];
        $usr_key = page('forum-users')->users()->toStructure()->findBy('user', $usr_name)->key();

        $url_root = 'https://forum.englishes-mooc.org/';
        $url = $url_root . 'session?api_key=' . $usr_key . '&api_username=' . $usr_name . '&login=' . $usr_name . '&password=' . $usr_pw;
        $result = [];
        $request = Remote::post($url);
        $result = $request->json();

        return $result;
      }
    ],
    [
      // logout
      
      'method' => 'POST',
      'pattern' => 'apilogin',
      'action' => function () {
        $data = r::data();

        $usr_name = $data['name'];
        $usr_pw = $data['pw'];
        $usr_key = page('forum-users')->users()->toStructure()->findBy('user', $usr_name)->key();

        $url_root = 'https://forum.englishes-mooc.org/';

        $url = $url_root . 'session?api_key=' . $usr_key . '&api_username=' . $usr_name . '&login=' . $usr_name . '&password=' . $usr_pw;
        $result = [];
        $request = Remote::post($url);
        $result = $request->json();

        return $result;
      }
    ],
    [
      // post_upload
      
      'method' => 'POST',
      'pattern' => 'apimsg',
      'action' => function () {
        $data = r::data();

        $title = $data['title'];
        $disc_tab = $data['disc_tab'];
        $disc_id = $data['disc_id'];
        /* $ass_id = $data['ass_id']; */
        $msg = $data['raw'];
        $usr_name = $data['user'];
        $usr_key = page('forum-users')->users()->toStructure()->findBy('user', $usr_name)->key();

        $url_root = 'https://forum.englishes-mooc.org/';

        $url = $url_root . 'posts.json?api_key=' . $usr_key . '&api_username=' . $usr_name . "&title='" . $title . "'&topic_id=" . $disc_id . '&raw=' . $msg;

        $result = [];
        $request = Remote::post($url);
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
        $usr_name = $data['user'];
        $usr_key = page('forum-users')->users()->toStructure()->findBy('user', $usr_name)->key();

        $url_root = 'https://forum.englishes-mooc.org/';

        // url: `${url_root}/posts/${opts.id}?api_key=${opts.user_k}&api_username=${opts.user_v}`,

// https://forum.englishes-mooc.org/posts/281?api_key=1b1655f72eeedc2324cfbdd88a24b5a1903150a4a995ee2fed4e503c3bc806e3&api_username=guest click.js:138


        $url = $url_root . 'posts/' . $post_id . '?api_key=' . $usr_key . '&api_username=' . $usr_name;

        $result = [];
        $request = Remote::delete($url);
        $result = $request->json();

        return $result;
      }
    ]
  ]
]);
