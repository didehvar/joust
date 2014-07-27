Template.news.created = function() {
  Session.set('discourseNews', ['Loading latest news...']);

  Meteor.call('discourseGetNews', function(error, result) {
    if (error) {
      return alert.danger('Unable to laod news - ' + error);
    }

    console.log('set news');
    return Session.set('discourseNews', result);
  });
};

Template.news.posts = function () {
  return Session.get('discourseNews');
};

Template.newsPost.created = function() {
  if (!this.data || !this.data.id || !this.data.slug) {
    return console.log('id or slug missing for topic');
  }

  Meteor.call('discourseGetPost', this.data.id, this.data.slug, this.data.title,
              function(error, result) {
    if (error) {
      return console.log(error);
    }

    $('.news-post-' + result.topic_id + ' .news-title').html(
      '<a href="' + Meteor.settings.public.discourseUrl + '/t/' + result.topic_slug +
      '/' + result.topic_id + '">' +
        result.title +
      '</a>'
    );
    $('.news-post-' + result.topic_id + ' .news-content').html(result.cooked);
  });
}

Template.newsPost.id = function() {
  if (!this || !this.id) {
    return console.log('id missing');
  }

  return this.id;
}
