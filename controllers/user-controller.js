const { User } = require('../models');

const userController = {
	getUsers(req, res) {
		User.find({})
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},
	getUserById({ params }, res) {
		User.findOne({ _id: params.id })
			.populate({
				path: 'friends',
				select: '-__v',
			})
			.select('-__v')
			.populate({
				path: 'thoughts',
				select: '-__v',
			})
			.select('-__v')
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this ID' });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},
	createUser({ body }, res) {
		User.create(body)
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this ID' });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},

	addFriend(req, res) {
		console.log(req.params.friendsId);
		User.findOneAndUpdate(
			{ _id: req.params.userId },
			{ $addToSet: { friends: req.params.friendsId } },
			// { new: true },
			{ runValidators: true, new: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this ID' });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.status(400).json(err));
	},

	updateUser({ params, body }, res) {
		User.findOneAndUpdate({ _id: params.id }, body, {
			new: true,
			runValidators: true,
		})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this ID' });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.status(400).json(err));
	},
	removeFriend(req, res) {
		User.findOneAndUpdate(
			{ _id: req.params.userId },
			{ $pull: { friends: req.params.friendsId } },
			{ runValidators: true, new: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this ID' });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.status(400).json(err));
	},
	deleteUser({ params }, res) {
		User.findByIdAndDelete({ _id: params.id })
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this ID' });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.status(400).json(err));
	},
};

module.exports = userController;
