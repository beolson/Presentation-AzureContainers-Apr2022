FROM python:3.9-slim

# Update and install packages.
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install --no-install-recommends -y freetds-bin git unixodbc unixodbc-dev poppler-utils tdsodbc && \
    apt-get install --reinstall -y build-essential && \
    # Clean up after installs.
    apt-get purge --auto-remove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install ODBC driver.
RUN apt-get update && \
    apt-get install --no-install-recommends -y curl && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y mssql-tools && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 && \
    # Add paths to drivers to config files.
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile && \
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc && \
    /bin/bash -c "source ~/.bashrc" && \
    # Clean up after installs.
    apt-get purge --auto-remove -y curl && \
    apt-get purge --auto-remove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create non-privileged user to run app.
RUN useradd --create-home appuser
USER appuser

# Set working directory.
WORKDIR /home/appuser

# Copy and install requirement file from repo.
COPY --chown=appuser requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt && \
    rm requirements.txt

# Copy repository to image.
COPY --chown=appuser . /home/appuser/

# Set Python path environment variable.
ENV PYTHONPATH "/home/appuser"

# Expose port.
EXPOSE 5000

# Run Flask app.
CMD python -m flask run --port 5000 --host 0.0.0.0