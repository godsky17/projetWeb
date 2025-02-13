import SideBar from '../../conpoments/SideBar/SideBar';
import ProfilHeader from '../../conpoments/ProfilHeader/ProfilHeader';
import ProfilTabs from '../../conpoments/ProfilTabs/ProfilTabs';
import './Profile.css';

const Profile = () => {
  return (
    <div className="d-flex">
      <SideBar />
      <div className="main-content">
        <div className="container-fluid py-4">
          <ProfilHeader />
          <div className="mt-4">
            <ProfilTabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;