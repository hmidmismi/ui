import type { ReactNode } from 'react';
import { announcement } from '../../styled-system/recipes';
import type { LinkTag } from './nav';

export type AnnouncementProps = { children: ReactNode };

/** The strip above the header. Put the statement and its link inside. */
export function Announcement({ children }: AnnouncementProps) {
  const s = announcement();
  return (
    <div className={s.root} role="note">
      <p className={s.text}>{children}</p>
    </div>
  );
}

/** Styled link for use inside `Announcement` text. */
export function AnnouncementLink({
  as: Tag = 'a',
  ...props
}: {
  as?: LinkTag;
  href: string;
  children: ReactNode;
}) {
  return <Tag className={announcement().link} {...props} />;
}
