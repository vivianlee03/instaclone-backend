import client from "../client.js";

export default {
  Photo: {
    user: ({ userId }) => {
      return client.user.findUnique({ where: { id: userId } });
    },
    hashtags: ({ id }) => {
      return client.hashtags.findMany({ where: { photos: { some: { id } } } });
    },
    likes: ({ id }) => {
      return client.like.count({ where: { photoId: id } });
    },
    commentNumber: ({ id }) => {
      return client.comment.count({ where: { photoId: id } });
    },
    comments: ({ id }) => {
      return client.comment.findMany({
        where: { photoId: id },
        include: {
          user: true,
        },
      });
    },
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
    isLiked: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const ok = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        select: {
          id: true,
        },
      });
      if (ok) {
        return true;
      }
      return false;
    },
  },
  Hashtag: {
    photos: ({ id }) => {
      return client.hashtag
        .findUnique({ where: { id } })
        .photos({ take: 2, skip: (page - 1) * 2 });
    },
    totalPhotos: ({ id }) => {
      return client.photo.count({ where: { hashtags: { some: { id } } } });
    },
  },
};
