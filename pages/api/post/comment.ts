import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
    const { comment, postId, email } = req.body;
    console.log('comment : ', comment);

    const result = await prisma.comment.create({
        data: {
            body: comment,
            author: { connect: { email: email } },
            post: {connect: {id: postId}}
        },
    });
    res.json(result);
}
