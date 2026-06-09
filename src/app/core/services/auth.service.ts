import { Injectable, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ActiveUser } from '../models/user.model';

const ACTIVE_USER_KEY = 'careerTrack.activeUser';

interface GraphQLUser {
  userId: string;
  name: string;
  email: string;
}

interface LoginResponse {
  login: {
    user: GraphQLUser;
  };
}

interface SignupResponse {
  signup: {
    user: GraphQLUser;
  };
}

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        userId
        name
        email
      }
    }
  }
`;

const SIGNUP = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      user {
        userId
        name
        email
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly activeUserSignal = signal<ActiveUser | null>(this.readStoredUser());

  readonly activeUser = this.activeUserSignal.asReadonly();

  constructor(private apollo: Apollo) {}

  login(email: string, password: string): Observable<ActiveUser | null> {
    const normalizedEmail = email.trim().toLowerCase();

    return this.apollo
      .mutate<LoginResponse>({
        mutation: LOGIN,
        variables: {
          email: normalizedEmail,
          password,
        },
      })
      .pipe(
        map((result) => result.data?.login?.user ?? null),
        map((user) => (user ? this.toActiveUser(user) : null)),
        tap((user) => {
          if (user) {
            this.setActiveUser(user);
          }
        }),
        catchError(() => of(null)),
      );
  }

  signup(name: string, email: string, password: string): Observable<ActiveUser | null> {
    const normalizedEmail = email.trim().toLowerCase();

    return this.apollo
      .mutate<SignupResponse>({
        mutation: SIGNUP,
        variables: {
          name: name.trim(),
          email: normalizedEmail,
          password,
        },
      })
      .pipe(
        map((result) => result.data?.signup?.user ?? null),
        map((user) => (user ? this.toActiveUser(user) : null)),
        tap((user) => {
          if (user) {
            this.setActiveUser(user);
          }
        }),
        catchError(() => of(null)),
      );
  }

  logout(): void {
    localStorage.removeItem(ACTIVE_USER_KEY);
    this.activeUserSignal.set(null);
  }

  isLoggedIn(): boolean {
    return Boolean(this.activeUserSignal());
  }

  getCurrentUserId(): string | null {
    return this.activeUserSignal()?.id ?? null;
  }

  private setActiveUser(user: ActiveUser): void {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    this.activeUserSignal.set(user);
  }

  private readStoredUser(): ActiveUser | null {
    const stored = localStorage.getItem(ACTIVE_USER_KEY);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as ActiveUser;
    } catch {
      localStorage.removeItem(ACTIVE_USER_KEY);
      return null;
    }
  }

  private toActiveUser(user: GraphQLUser): ActiveUser {
    return {
      id: user.userId,
      name: user.name,
      email: user.email,
    };
  }
}
