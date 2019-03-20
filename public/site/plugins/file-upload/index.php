<?php

Kirby::plugin('mooc/upload', [
  'routes' => [
    [
      'method' => 'POST',
      'pattern' => 'apiupload',
      'action' => function (string $path = '/') {
        print_r('hola there');
        return $this->upload(function ($source, $filename) use ($path) {
          return $this->parent($path)->createFile([
            'source' => $source,
            'template' => $this->requestBody('template'),
            'filename' => $filename
          ]);
        });
      }
    ]
  ]
]);
