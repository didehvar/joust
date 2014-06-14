Meteor.methods({
	// Fetches all discourse topics in the news category.
	'discourseGetNews': function() {
		var result = HTTP.get(Meteor.settings.public.discourseUrl + '/category/news.json');

		if (!result || result.statusCode !== 200) {
			return { error: error || 'URL not found' };
		}

		if (!result.data || !result.data.topic_list) {
			return { title: 'No topic lists found' };
		}

		if (!result.data.topic_list.topics ||
				result.data.topic_list.topics.length === 0) {
			return { title: 'No topics found' };
		}

		// Remove pinned topics.
		var ret = result.data.topic_list.topics;
		for (var i = ret.length; i >= 0; i--) {
			if (ret[i] && ret[i].pinned) {
				ret.splice(i, 1);
			}
		}

		var topics = _.sortBy(result.data.topic_list.topics, function(data) {
			return moment(data.created_at).unix();
		});

		// Array of topics.
		return topics.reverse().slice(0, Meteor.settings.newsPosts);
	},

	// Fetches the first post from a discourse topic.
	//
	// Topic title is optional, but can be extremely useful to provide as the post
	// doesn't provide its topic title. The topic title is simply inserted into
	// the returned object as .title.
	'discourseGetPost': function(topicId, topicSlug, topicTitle) {
		var result = HTTP.get(
			Meteor.settings.public.discourseUrl + '/t/' + topicSlug + '/' + topicId +
			'.json'
		);

		if (!result || result.statusCode !== 200) {
			return { error: error || 'URL not found' };
		}

		if (!result.data || !result.data.id) {
			return { error: 'No topic found' };
		}

		if (!result.data.post_stream ||
				!result.data.post_stream.posts ||
				result.data.post_stream.posts.length === 0) {
			return { title: 'No posts found' };
		}

		// Add topic title to post.
		var ret = result.data.post_stream.posts[0];
		ret.title = topicTitle || '';

		return ret;
	}
});
