<?php

Kirby::plugin('mrflix/cachebuster', [
  'options' => [
    'active' => true
  ],
  'components' => [
    'css' => function ($kirby, $url, $options) {
      if($kirby->option('mrflix.cachebuster.active')){
        $file = $kirby->roots()->index() . DS . $url;
        return dirname($url) . '/' . F::name($url) . '.' . F::modified($file) . '.css';
      } else {
        return $url;
      }
    },
    'js' => function ($kirby, $url, $options) {
      if($kirby->option('mrflix.cachebuster.active')){
        $file = $kirby->roots()->index() . DS . $url;
        return dirname($url) . '/' . F::name($url) . '.' . F::modified($file) . '.js';
      } else {
        return $url;
      }
    }
  ]
]);
