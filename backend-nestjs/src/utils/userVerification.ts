import { BlogRepository } from 'src/blog-service/blog.repository';

export class UserVerification {
  constructor(private blogRepository: BlogRepository) {}

  async verifyIfUserisAuthorizedToModify(blogId, userId) {
    const getBlog = await this.blogRepository.get(blogId);
    const { author_id } = getBlog;
    if (author_id !== userId) {
      throw new Error('Unauthorized User');
    }
    return true;
  }

  async verifyIfUserAndReviewerisAuthorizedToModify(blogId, reviewer_user_id) {
    const getBlog = await this.blogRepository.get(blogId);
    const { author_id } = getBlog;

    //call service to gps to get teamLeadId
    if (reviewer_user_id !== 'teamLeadid') {
      throw new Error('Unauthorized Reviewer');
    }
    return true;
  }
}
