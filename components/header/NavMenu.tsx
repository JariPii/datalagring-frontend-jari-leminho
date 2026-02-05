import Link from 'next/link';

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '../ui/menubar';
import { links } from '@/utils/links';

const NavMenu = () => {
  return (
    <div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Navigate</MenubarTrigger>
          <MenubarContent>
            {/* <MenubarGroup>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup> */}
            {/* <MenubarSeparator /> */}
            <MenubarGroup>
              {links.map((link) => {
                return (
                  <MenubarItem key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </MenubarItem>
                );
              })}
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default NavMenu;
