import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import PageTitle from '@/components/admin/PageTitle';
import { Card, CardContent } from '@/components/ui/Card';
import CommentActions from '@/components/admin/comments/CommentActions';
import CommentActionButtons from '@/components/admin/comments/CommentActionButtons';
import EmptyState from '@/components/admin/comments/EmptyState';

async function getComments() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      blog: true,
      parent: true,
    },
  });

  return comments;
}

export default async function CommentsPage() {
  const comments = await getComments();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Comments" />
        <div className="flex items-center space-x-2">
          <CommentActions />
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Comment
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Blog
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <tr
                      key={comment.id}
                      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {comment.authorEmail}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate">
                          {comment.parentId && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full mr-2">
                              Reply
                            </span>
                          )}
                          {comment.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={`/blog/${comment.blog.slug}`} 
                          target="_blank" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {comment.blog.title.length > 30 
                            ? comment.blog.title.substring(0, 30) + '...' 
                            : comment.blog.title}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            comment.isApproved
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          }`}
                        >
                          {comment.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CommentActionButtons
                          commentId={comment.id}
                          isApproved={comment.isApproved}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <EmptyState />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
