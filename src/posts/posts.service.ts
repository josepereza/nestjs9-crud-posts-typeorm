import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  usuario = {};
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  // title, content, authorId
  async createPost(post: CreatePostDto) {
    const userFound = await this.usersService.getUser(post.userId);

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log(post);
    const createdPost = this.postsRepository.create(post);

    return this.postsRepository.save(createdPost);
  }

  getPosts() {
    return this.postsRepository.find({ relations: ['author'] });
  }
}
