var getPost = function(post) {
  Meteor.call('discourseGetPost', post.id, post.slug, post.title, function(error, result) {
    if (error) {
      return alert.danger('Failed to load topic (' + post.id + ')');
    }

    _.extend(result, post);

    if (Session.get('discourseNews')) {
      result = Session.get('discourseNews').push(result);
    } else {
      result = [result];
    }

    Session.set('discourseNews', result);
  });
};

Template.news.created = function() {
  Session.set('discourseNews', false);

  Meteor.call('discourseGetNews', function(error, result) {
    if (error) {
      return alert.danger('Unable to laod news - ' + error);
    }

    _.each(result, getPost);
  });
};

Template.news.posts = function () {
  return Session.get('discourseNews');
};

Template.newsPost.discourseLink = function() {
  return Meteor.settings.public.discourseUrl;
}

Template.newsPost.createdMoment = function() {
  if (!this.created_at) {
    return;
  }

  return moment(this.created_at).format('D MMM YYYY');
}

Template.newsPost.content = function() {
  if (!this.cooked) {
    return;
  }

  return this.cooked.match(/<p>(.*)<\/p>/)[0];
}
