import NavMenu from './NavMenu';

const Header = () => {
  return (
    <div className=''>
      <div className='h-[10dvh] w-full border-b-2 flex items-center justify-center text-4xl overflow-visible'>
        <h1>SkillFlow</h1>
        <div className='absolute right-10'>
          {' '}
          {/* Positionera den åt sidan för att inte krocka med h1 */}
          <NavMenu />
        </div>
      </div>
    </div>
  );
};

export default Header;
