Meteor.methods({
	// Fetches all discourse topics in the news category.
	'discourseGetNews': function() {
		var result = HTTP.get(Meteor.settings.public.ssoUrl + '/category/news.json');

		if (!result || result.statusCode !== 200) {
			throw new Meteor.Error(404, 'URL not found');
		}

		if (!result.data || !result.data.topic_list) {
			throw new Meteor.Error(404, 'No topic lists found');
		}

		if (!result.data.topic_list.topics ||
				result.data.topic_list.topics.length === 0) {
			throw new Meteor.Error(404, 'No topics found');
		}

		// Remove pinned topics.
		var ret = result.data.topic_list.topics;
		for (var i = ret.length; i >= 0; i--) {
			if (ret[i] && ret[i].pinned) {
				ret.splice(i, 1);
			}
		}

		// Array of topics.
		return result.data.topic_list.topics.slice(0, 5);
	},

	// Fetches the first post from a discourse topic.
	//
	// Topic title is optional, but can be extremely useful to provide as the post
	// doesn't provide its topic title. The topic title is simply inserted into
	// the returned object as .title.
	'discourseGetPost': function(topicId, topicSlug, topicTitle) {
		var result = HTTP.get(
			Meteor.settings.public.ssoUrl + '/t/' + topicSlug + '/' + topicId +
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
