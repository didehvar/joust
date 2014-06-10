Template.news.created = function() {
  Meteor.call('discourseGetNews', function(error, result) {
    if (error) {
      return Session.set('discourseNews', error);
    }

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

    $('.news-title').html(result.title);
    $('.news-content').html(result.cooked);
  });
}
