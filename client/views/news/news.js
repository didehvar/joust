var getPost = function(post) {
  Meteor.call('discourseGetPost', post.id, post.slug, post.title, function(error, result) {
    if (error) {
      return alert.danger('Failed to load topic (' + post.id + ')');
    }

    _.extend(result, post);
    console.log(result);

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

// Template.newsPost.created = function() {
//   if (!this.data || !this.data.id || !this.data.slug) {
//     return console.log('id or slug missing for topic');
//   }
//
//   var replies = this.data.posts_count;
//
//   Meteor.call('discourseGetPost', this.data.id, this.data.slug, this.data.title,
//               function(error, result) {
//     if (error) {
//       return console.log(error);
//     }
//
//     console.log(result);
//
//     var id = 'discourse' + this.id;
//
//     Session.set(id + 'title', result.title);
//     Session.set(id + 'content', result.cooked);
//
//     Session.set(id + 'link', Meteor.settings.public.discourseUrl + '/t/' +
//                              result.topic_slug + '/' + result.topic_id);
//
//     $('.news-post-' + result.topic_id + ' .news-title').html(
//       '<a href="' + discourseLink  + '">' +
//         result.title +
//       '</a>'
//     );
//     $('.news-post-' + result.topic_id + ' .news-content').html(result.cooked);
//
//     $('.news-post-' + result.topic_id + ' .news-discourse').html(
//       '<a href="' + discourseLink  + '">' +
//         'Join the discussion (' + replies + ' replies)' +
//       '</a>'
//     );
//   });
// }
//
// Template.newsPost.id = function() {
//   if (!this || !this.id) {
//     return console.log('id missing');
//   }
//
//   return this.id;
// }
//
// Template.newsPost.title = function() {
//   return Session.get('discourse' + this.id + 'title');
// }
//
// Template.newsPost.content = function() {
//   return Session.get('discourse' + this.id + 'content');
// }
//
// Template.newsPost.link = function() {
//   return Session.get('discourse' + this.id + 'link');
// }
