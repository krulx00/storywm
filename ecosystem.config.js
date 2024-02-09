module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		// First application
		{
			name: 'storywm', // name of the process in PM2
			script: 'node -r dotenv/config build',
            watch:true,
            env:{
                "PORT": 8000,
                "NODE_ENV":"development"
            }
			
		}
	],

	/**
	 * Deployment section
	 * http://pm2.keymetrics.io/docs/usage/deployment/
	 */
	deploy: {
		production: {
			user: 'mdkruls', // deployer user
			host: '184.168.124.26', // IP address of your server
			ref: 'origin/main', // the branch you want to deploy
			repo: 'https://github.com/krulx00/storywm.git', // the ssh git clone URL
			path: '/var/www/storywm/', // the path where you want the project to be
			// code you want to run after the project has been pushed to your server
			'post-deploy':
				'npm install && npm run build && pm2 reload ecosystem.config.js'
		}
	}
};