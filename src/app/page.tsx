import { redirect } from 'next/navigation';

export default function Home() {
  // 将根路径访问重定向到/blogs路径
  redirect('/blogs');
  
  // 这里的代码不会执行，因为redirect会中断执行
  return null;
}
