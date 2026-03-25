const express = require('express');
const app = express();

const db = require('./db');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const sql = `
    SELECT articles.*, auteurs.nom AS auteur, categories.nom AS categorie
    FROM articles
    JOIN auteurs ON articles.auteur_id = auteurs.id
    JOIN categories ON articles.categorie_id = categories.id
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    console.log(results);

    if (err) {
        console.error(err);
        return res.send('Erreur serveur');
    }

    res.render('index', { articles: results });
    });
});

app.get('/article/:id', (req, res) => {
  const id = req.params.id;

  const articleSql = `
    SELECT articles.*, auteurs.nom AS auteur, categories.nom AS categorie
    FROM articles
    JOIN auteurs ON articles.auteur_id = auteurs.id
    JOIN categories ON articles.categorie_id = categories.id
    WHERE articles.id = ?
  `;

  db.query(articleSql, [id], (err, articleResult) => {
    if (err) {
      console.error(err);
      return res.send('Erreur serveur');
    }

    if (articleResult.length === 0) {
      return res.redirect('/'); // article inexistant
    }

    const tagSql = `
      SELECT tags.nom 
      FROM tags
      JOIN article_tag ON tags.id = article_tag.tag_id
      WHERE article_tag.article_id = ?
    `;

    const commentSql = `
      SELECT * FROM commentaires WHERE article_id = ?
    `;

    db.query(tagSql, [id], (err, tags) => {
      db.query(commentSql, [id], (err, comments) => {
        res.render('article', {
          article: articleResult[0],
          tags,
          comments
        });
      });
    });
  });
});

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});