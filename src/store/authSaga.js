import { call, put, takeLatest } from 'redux-saga/effects';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { loginRequest, loginSuccess, loginFailure, logout } from './authSlice';

const ADMIN_EMAIL = 'admin123@gmail.com';

function* loginSaga(action) {
  try {
    const { email, password } = action.payload;
    const userCredential = yield call(signInWithEmailAndPassword, auth, email, password);
    if (!ADMIN_EMAIL.includes(userCredential.user.email)) {
      throw new Error('Not an admin');
    }
    yield put(loginSuccess(userCredential.user));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* logoutSaga() {
  yield call(signOut, auth);
}

export default function* authRootSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logout.type, logoutSaga);
} 