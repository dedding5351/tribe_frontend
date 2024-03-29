import React, { useState } from 'react';
import UserSetupStep1 from '../UserSetupStep1';
import UserSetupStep2 from '../UserSetupStep2';
import UserSetupStep3 from '../UserSetupStep3';
import UserSetupStep4 from '../UserSetupStep4';
import UserSetupStep5 from '../UserSetupStep5';
import UserSetupComplete from '../UserSetupComplete';
import './UserSetupForm.css';
import { BASE_URL } from '../config';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../helpers';
import { useDispatch } from 'react-redux';
import { getFamilyFromAPI, getFamilyMembersFromAPI, getFamilyTasksFromAPI, getUserFromAPI, gotUserFirstLastName, startLoading } from '../actionCreators';
import { Alert } from 'react-bootstrap';

function UserSetupForm() {
  const INITIAL_USER_VALUES = { first_name: "", last_name: "", isParent: true, family_code: "", family_name: "" };
  const [hasFamilyId, setHasFamilyId] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_USER_VALUES);
  const [serverErr, setServerErr] = useState("");
  const [isRedirect, setIsRedirect] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (evt: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = evt.currentTarget;
    setFormData(currData => ({ ...currData, [name]: value }));
  }

  const handleIsParentChange = (value: boolean) => {
    setFormData(currData => ({ ...currData, isParent: value }));
    next();
  }

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setServerErr("");

    const token = getCookie("x-access-token")

    try {
      if (!hasFamilyId) {
        const newFamResp = await fetch(`${BASE_URL}/create-family`, {
          method: 'POST',
          headers: {
            "Content-type": "application/json",
            "x-access-token": `${token}`,
          },
          body: JSON.stringify({ family_name: formData.family_name }),
          credentials: "include"
        });
        
        if (newFamResp.status !== 201) {
          const newFamRespData = await newFamResp.json();
          setServerErr(newFamRespData.msg);
        }
      }


      const resp = await fetch(`${BASE_URL}/update-user`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
        headers: {
          "Content-type": "application/json",
          "x-access-token": `${token}`,
        },
        credentials: 'include',
      });
      const respData = await resp.json();
      if (resp.status === 200) {
        dispatch(gotUserFirstLastName(formData.first_name, formData.last_name));
        next();
      } else if (resp.status === 404 && respData.msg === "Family code has expired or code is incorrect - please get a new code") {
        setServerErr("Family code does not exist or has expired! Please get a new code and try again.");
      }
    } catch (err) {
      alert(`error:${err}`);
    }
  }

  const handleRedirect = () => {
    dispatch(startLoading());
    dispatch(getUserFromAPI());
    dispatch(getFamilyFromAPI());
    dispatch(getFamilyMembersFromAPI());
    dispatch(getFamilyTasksFromAPI());
    setIsRedirect(true);
  }

  const next = () => {
    setCurrentStep(currentStep + 1);
  }

  const prev = () => {
    setCurrentStep(currentStep - 1);
  }

  return (
    <div className="UserSetupForm" id="UserSetupForm">
      { serverErr && <Alert className="App-alert" variant="danger">{serverErr}</Alert>}
      <UserSetupStep1 value={formData.first_name} handleChange={handleChange} next={next} currentStep={currentStep} />
      <UserSetupStep2 value={formData.last_name} handleChange={handleChange} next={next} prev={prev} currentStep={currentStep} />
      <UserSetupStep3 value={formData.isParent} handleIsParentChange={handleIsParentChange} next={next} prev={prev} currentStep={currentStep} />
      <UserSetupStep4 setHasFamilyId={setHasFamilyId} next={next} currentStep={currentStep} prev={prev} />
      <UserSetupStep5 isParent={formData.isParent} famIdValue={formData.family_code} famNameValue={formData.family_name} hasFamilyId={hasFamilyId} handleChange={handleChange} handleSubmit={handleSubmit} next={next} prev={prev} currentStep={currentStep} />
      <UserSetupComplete currentStep={currentStep} handleRedirect={handleRedirect} />
      { isRedirect && <Redirect to="/tribe/overview"/>}
    </div>
  );
}

export default UserSetupForm;