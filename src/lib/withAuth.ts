// lib/withAuth.tsx
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { routerConfig } from '@/config/router.config';

// Тип для Server Component (асинхронная функция, возвращающая JSX)
type ServerComponent = () => Promise<React.ReactNode>;

/**
 * Обёртка для страниц, требующих авторизации
 */
export function withAuth(
  WrappedComponent: ServerComponent,
  options: { role?: string } = {}
) {
  return async function AuthenticatedComponent() {
    const payload = await getPayload({ config });
    const headersList = await headers();
    const user = await payload.auth({ headers: headersList });

    if (!user.user) {
      redirect(routerConfig.home);
    }

    if (options.role && user.user.role !== options.role) {
      redirect(routerConfig.home);
    }

    // ✅ Теперь всё правильно: WrappedComponent — это функция
    return await WrappedComponent();
  };
}
