const crypto = require('crypto')

class Task {
  constructor({
    label,
    deadline,
    description,
    createdAt,
    id
  }) {
    this.label = label;
    this.deadline = deadline,
    this.description = description;
    this.createdAt = createdAt;
    this.id = id ?? crypto.randomUUID()
  }
}

module.exports = {Task}