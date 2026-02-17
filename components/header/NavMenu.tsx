import Link from 'next/link';

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '../ui/menubar';
import { links } from '@/utils/links';

const NavMenu = () => {
  return (
    <div>
      {/* <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Navigate</MenubarTrigger>
          <MenubarContent>
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
      </Menubar> */}
      Test
    </div>
  );
};

export default NavMenu;
