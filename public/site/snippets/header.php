<!doctype html>
<html lang="<?= site()->language() ? site()->language()->code() : 'en' ?>">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">

  <title><?= $site->title()->html() ?> | <?= $page->title()->html() ?></title>
  <meta name="description" content="<?= $site->description()->html() ?>">

  <?= css('/assets/css/bundle.css') ?>
</head>
<body>

  <?php
$spad = function () {

  function buildTree ($parent) {
    $filterEach = kirby()->option('spad.filterEach', function ($page) {
      return $page;
    });

    $tree = [];
    if ($parent->id()) {
      $tree = array_merge($tree, $parent->toArray());
    } else {
      $tree['content'] = $parent->content()->toArray();
    }

    $tree['files'] = $parent->files()->sortBy('sort', 'asc')->toArray();

    $tree['children'] = array_map(function ($n) {
      return buildTree(site()->find($n['id']));
    }, $parent->children()->visible()->toArray());

    return $filterEach($tree);
  }

  return buildTree(site());
  };
  ?>
