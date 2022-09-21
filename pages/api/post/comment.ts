import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
    const { comment, postId } = req.body;
    const session = await getSession({ req });
    const result = await prisma.comment.create({
        data: {
            body: comment,
            author: { connect: { email: session?.user?.email } },
            post: {connect: {id: postId}}
        },
    });
    res.json(result);
}
