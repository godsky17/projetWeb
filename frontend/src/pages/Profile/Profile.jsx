import SideBar from '../../conpoments/SideBar/SideBar';
import ProfilHeader from '../../conpoments/ProfilHeader/ProfilHeader';
import ProfilTabs from '../../conpoments/ProfilTabs/ProfilTabs';
import './Profile.css';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return (
    <div className="d-flex">
      <SideBar />
      <div className="main-content">
        <div className="container-fluid py-4">
          <ProfilHeader  user={user}/>
          <div className="mt-4">
            <ProfilTabs user={user}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;