var Model = Ember.Object.extend(Ember.Copyable, {
  init: function() {
    if (Em.isNone(this.constructor.storageKey)) {
      throw new Error(Ember.String.fmt("%@ has to implement storageKey property", [this]));
    }

    if (Em.isNone(this.get('guid'))) {
      this.set('guid', guid());
    }
  },

  guid: null,

  copy: function() {
    return Em.run(this.constructor, 'create', this.serialize());
  },

  serialize: function() {
    throw new Error(Ember.String.fmt("%@ has to implement serialize to convert to JSON.", [this]));
  }
});

Model.reopenClass({
  storageKey: null
});

module.exports = Model;
