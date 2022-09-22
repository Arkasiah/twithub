import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
    const { comment, postId } = req.body;
    console.log('comment : ', comment);

    const session = await getSession({ req });
    const result = await prisma.comment.create({
        data: {
            body: comment,
            author: { connect: { email: session?.user?.email } },
            post: {connect: {id: postId}}
        },
    });
    console.log("result", result);
    res.json(result);
}
