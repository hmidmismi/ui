'use client';

import { useEffect, useRef } from 'react';
import { menu } from '../../styled-system/recipes';
import type { LinkTag, NavItem } from './nav';

/** Kana numerals that lead the items of the mobile menu, in order. */
export const KANA_NUMERALS = ['い', 'ろ', 'は', 'に', 'ほ', 'へ', 'と'] as const;

export type MenuProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  /** The same list the footer shows (Contact, Accessibility, Instagram). */
  footerUtility?: NavItem[];
  as?: LinkTag;
};

/**
 * The full-screen menu on small screens. Locks page scroll while open, closes on Escape, and returns focus to
 * whatever had it before it opened.
 */
export function Menu({ id, open, onClose, items, footerUtility, as: Tag = 'a' }: MenuProps) {
  const m = menu();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    const opener = document.activeElement;
    root.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [open]);

  return (
    <div id={id} className={m.root} data-open={open ? '' : undefined} aria-hidden={!open}>
      <ul className={m.list}>
        {items.map((item, index) => (
          <li key={item.href} className={m.item}>
            <span className={m.numeral} aria-hidden="true">
              {KANA_NUMERALS[index]}
            </span>
            <Tag href={item.href} className={m.label} onClick={onClose} tabIndex={open ? 0 : -1}>
              {item.label}
            </Tag>
          </li>
        ))}
      </ul>
      {footerUtility?.length ? (
        <nav className={m.utility} aria-label="Footer">
          {footerUtility.map((link) => (
            <Tag
              key={link.href}
              href={link.href}
              className={m.utilityLink}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
            >
              {link.label}
            </Tag>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
