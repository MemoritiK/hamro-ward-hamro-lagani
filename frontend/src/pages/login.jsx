import Layout from "../components/Layout";

export default function Login() {
  return (
    <Layout>
      <div className="max-w-lg mt-20 mx-auto bg-gray-200 p-8 rounded-xl shadow-lg">
        <form className="space-y-6">
          <fieldset className="space-y-6">
            <legend className="text-2xl font-bold text-blue-600 border-b border-gray-400 pb-3 mb-3">
              Please Login
            </legend>

            {/* Username / Phone */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username or Phone Number
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username or phone"
                className="pl-2 mt-1 block w-full rounded-md border-gray-400 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="pl-2 mt-1 block w-full rounded-md border-gray-400 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                required
              />
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
}
