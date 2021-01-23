import React, { useEffect, useState } from 'react';
import { IonContent, IonInput, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption, IonDatetime, IonAvatar, IonToast } from '@ionic/react';
import fire from 'firebase';

import './styles.css';

interface updateInfo {
    type: string;
    updateID: string;
}

const UpdateData: React.FC<updateInfo> = ({type, updateID}) => {
  const db = fire.firestore();
  //eslint-disable-next-line
  const [ID, setID] = useState(updateID);
  const [team, setTeam] = useState<string>();
  const [stadium, setStadium] = useState<string>();
  const [fileUrl, setFileUrl] = useState();
  const [validated, setValidated] =  useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [visitorTeam, setVisitorTeam] = useState('');
  const [teams, setTeams] = useState([{}]);
  const [updatingLogo, setUpdatingLogo] = useState(false);

  const onFileChange = async (e:any) =>{
    const file = e.target.files[0];
    const storageRef = fire.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
  }

  const submitTeam = (e:any) =>{
    e.preventDefault();

    db.collection("teams").doc(ID).update({
      ID,
      name: team,
      stadium,
      logo: fileUrl
    }).then(() =>{
      setValidated(true);
    }).catch(function (error) {
      console.error("Error updating document: ", error);
    });
  }

  const fetchData = async () => {
    if(type === 'team'){
    await db.collection("teams").doc(ID).get().then((doc:any) =>{
      setTeam(doc.data().name);
      setStadium(doc.data().stadium);
      setFileUrl(doc.data().logo);
    });
  } else if(type === 'game'){
    await db.collection("games").doc(ID).get().then((doc:any) =>{
      setHomeTeam(doc.data().homeTeam);
      setVisitorTeam(doc.data().visitorTeam);
      setSelectedDate(doc.data().selectedDate);
    });

    const fetchedTeams = await db.collection("teams").get();
    setTeams(
      fetchedTeams.docs.map((doc: any) => {
        return doc.data();
      })
    );
  }
  };

  const submitGame = (e:any) =>{
    e.preventDefault();
    db.collection("games").doc(ID).set({
      ID,
      homeTeam,
      visitorTeam,
      selectedDate
    }).then(() =>{
      setValidated(true);
    }).catch(function (error) {
      console.error("Error adding document: ", error);
    });
  }

  useEffect(() =>{
    fetchData();
     //eslint-disable-next-line
  }, []);
  
if(type === 'team') {
  return (
      <IonContent>
        <IonToast
        isOpen={validated}
        message="Team updated"
        duration={1000}
      />
         {validated ?  window.location.reload() : null}
        <form onSubmit={submitTeam}>
          <IonItem>
            <IonLabel position="floating">Team Name:</IonLabel>
            <IonInput value={team} onIonChange={e => setTeam(e.detail.value!)}> </IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Team Stadium:</IonLabel>
            <IonInput value={stadium} onIonChange={e => setStadium(e.detail.value!)}> </IonInput>
          </IonItem>
          {updatingLogo ? 
          <IonItem>
          <label>Team Logo:</label>
          <input type="file" onChange={onFileChange}/>
          </IonItem>:
          <IonItem onClick={() => setUpdatingLogo(true)}>
          Update Team Logo
            <IonAvatar slot="start">
            <img src={fileUrl} alt={`${team} logo`} />
            </IonAvatar>
          </IonItem>}
         <div className="submit-button">
         <IonButton expand="block" type="submit" fill="solid">Send</IonButton>
         </div>
       </form>
      </IonContent>
  );
} else if(type === 'game'){
  return(
      <IonContent>
        <IonToast
        isOpen={validated}
        message="Game updated"
        duration={1000}
      />
        {validated ?  window.location.reload() : null}
        <form onSubmit={submitGame}>
          <IonItem>
          <IonSelect value={homeTeam} onIonChange={ (e:any) => setHomeTeam(e.detail.value!)} placeholder={homeTeam} >
              {teams.map((team:any) =>{
                return (
                  <IonSelectOption key={Math.random()} value={team.name}>{team.name}</IonSelectOption>
                )
              })}
            </IonSelect>
          </IonItem>
          <IonItem>
          <IonSelect value={visitorTeam} onIonChange={ (e:any) => setVisitorTeam(e.detail.value!)} placeholder={visitorTeam}>
              {teams.map((team:any) =>{
                return (
                  <IonSelectOption key={Math.random()} value={team.name}>{team.name}</IonSelectOption>
                )
              })}
            </IonSelect>
          </IonItem>
         <IonItem>
         <IonLabel position="floating">Date:</IonLabel>
         <IonDatetime displayFormat={"MMM DD, YYYY HH:mm"} placeholder="Select Date" value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)}></IonDatetime>
         </IonItem>
         <div className="submit-button">
         <IonButton expand="block" type="submit" fill="solid">Send</IonButton>
         </div>
       </form>
      </IonContent>
  );
} else {
  return null;
}
};

export default UpdateData;