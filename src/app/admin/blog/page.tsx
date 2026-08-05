import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/site/admin/action-button";
import { BlogFormDialog } from "@/components/site/admin/blog-form-dialog";
import { deleteBlogPost } from "@/lib/admin-actions";
import { getAccessToken } from "@/lib/auth";
import { getAdminBlogPosts, getCampaigns } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const token = (await getAccessToken())!;
  const [posts, campaigns] = await Promise.all([getAdminBlogPosts(token), getCampaigns()]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">News &amp; Blog</h1>
        <BlogFormDialog campaigns={campaigns} trigger={<Button className="rounded-full">+ Create Post</Button>} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No posts yet.
                </TableCell>
              </TableRow>
            )}
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <BlogFormDialog
                    post={post}
                    campaigns={campaigns}
                    trigger={
                      <Button variant="outline" size="sm" className="rounded-full">
                        Edit
                      </Button>
                    }
                  />
                  <ActionButton
                    action={deleteBlogPost.bind(null, post.id)}
                    variant="destructive"
                    confirmMessage="Delete this post? This cannot be undone."
                    successMessage="Post deleted."
                  >
                    Delete
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
