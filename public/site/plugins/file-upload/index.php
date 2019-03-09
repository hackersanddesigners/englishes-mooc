<?php

Kirby::plugin('mooc/upload', [
  'routes' => [
    [
      'method' => 'POST',
      'pattern' => 'apiupload',
      'action'  => function () {
        if(r::is('POST')) {
          $r = r::data();

          $data = array(
            'module' => get('module'),
            'file' => get('file'),
            /* 'lastModified' => get('lastModified'), */
            /* 'name' => get('name'), */
            /* 'size' => get('size'), */
            /* 'type' => get('type') */
          );

          try {
            $p = site()->children()->findBy('uid', 'course')->children()->create(str::slug(time()), 'assignment', array(
              'module' => 'module-*',
              'file' => 'my file',
            ));
            echo 'The page has been created';

          } catch(Exception $e) {
            echo $e->getMessage();
            echo 'The page could not be created';
          }

          /* return response::json(json_encode($data)); */
        }

      }
    ]
  ]
]);
