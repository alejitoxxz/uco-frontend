import type { UserSummary } from '../../api/users'
import styles from './UsersTable.module.css'

interface UsersTableProps {
  data: UserSummary[]
}

const UsersTable = ({ data }: UsersTableProps) => {
  return (
    <section className={styles.tableCard} aria-live="polite">
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Listado de usuarios">
          <thead>
            <tr>
              <th scope="col">Nombre completo</th>
              <th scope="col">Email</th>
              <th scope="col">ID</th>
              <th scope="col">Móvil</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => {
              const fullName = [user.firstName, user.lastName ?? ''].filter(Boolean).join(' ')
              const mobileNumber = user.mobileNumber?.toString().trim()
              const formattedMobile = mobileNumber ? mobileNumber : '—'

              return (
                <tr key={user.id}>
                  <td className={styles.fullName}>{fullName}</td>
                  <td className={styles.email}>{user.email}</td>
                  <td className={styles.identifier}>{user.id}</td>
                  <td className={styles.mobile}>{formattedMobile}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default UsersTable
